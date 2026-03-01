package tn.iatechnology.backend.controller;

import tn.iatechnology.backend.dto.ActualiteDTO;
import tn.iatechnology.backend.dto.DomainDTO;
import tn.iatechnology.backend.dto.PublicationResponse;
import tn.iatechnology.backend.dto.ResearcherDTO;
import tn.iatechnology.backend.entity.Publication;
import tn.iatechnology.backend.repository.PublicationRepository;
import tn.iatechnology.backend.service.ActualiteService;
import tn.iatechnology.backend.service.AuditLogService;
import tn.iatechnology.backend.service.DomainService;
import tn.iatechnology.backend.service.PublicationService;
import tn.iatechnology.backend.service.ResearcherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.core.io.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.io.IOException;

/**
 * Endpoints 100% publics — aucune authentification requise.
 * Le chemin /api/public/** est autorisé via WebSecurityConfig (permitAll).
 * Ces routes n'ont PAS de @PreAuthorize pour éviter tout conflit.
 */
@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/public")
public class PublicController {

    @Autowired private PublicationService publicationService;
    @Autowired private PublicationRepository publicationRepository;
    @Autowired private ResearcherService researcherService;
    @Autowired private DomainService domainService;
    @Autowired private ActualiteService actualiteService;
    @Autowired private AuditLogService auditLogService;

    // ══════════════════════ PUBLICATIONS ══════════════════════

    /** GET /api/public/publications?page=0&size=10 */
    @GetMapping("/publications")
    public ResponseEntity<Page<PublicationResponse>> getAllPublications(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("datePublication").descending());
        Page<Publication> pageResult = publicationRepository.findAll(pageable);
        return ResponseEntity.ok(pageResult.map(publicationService::convertToResponse));
    }

    /** GET /api/public/publications/{id} */
    @GetMapping("/publications/{id}")
    public ResponseEntity<PublicationResponse> getPublicationById(@PathVariable Long id) {
        return ResponseEntity.ok(publicationService.getPublicationById(id));
    }

    /**
     * GET /api/public/publications/{id}/download
     * Téléchargement public du fichier PDF associé à une publication.
     */
    @GetMapping("/publications/{id}/download")
    public ResponseEntity<Resource> downloadPublicationPublic(@PathVariable Long id) throws IOException {
        auditLogService.log("DOWNLOAD", "PUBLICATION", id,
                "Téléchargement public du fichier PDF");
        return publicationService.downloadFile(id);
    }

    /**
     * GET /api/public/publications/search?keyword=...&domaineId=...&chercheur=...
     * Recherche multicritères avec intersection des résultats.
     */
    @GetMapping("/publications/search")
    public ResponseEntity<List<PublicationResponse>> searchPublications(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long domaineId,
            @RequestParam(required = false) String chercheur,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        boolean hasKeyword   = keyword   != null && !keyword.isBlank();
        boolean hasDomaine   = domaineId != null;
        boolean hasChercheur = chercheur != null && !chercheur.isBlank();

        if (!hasKeyword && !hasDomaine && !hasChercheur) {
            Pageable pageable = PageRequest.of(page, size, Sort.by("datePublication").descending());
            return ResponseEntity.ok(
                    publicationRepository.findAll(pageable).stream()
                            .map(publicationService::convertToResponse)
                            .collect(Collectors.toList())
            );
        }

        Set<Publication> results = null;

        if (hasDomaine) {
            results = intersect(results,
                    new LinkedHashSet<>(publicationRepository.findByDomainesId(domaineId)));
        }
        if (hasChercheur) {
            results = intersect(results,
                    new LinkedHashSet<>(publicationRepository.findByChercheurNomOuPrenom(chercheur, chercheur)));
        }
        if (hasKeyword) {
            results = intersect(results,
                    new LinkedHashSet<>(publicationRepository.findByKeywordInTitreOrResume(keyword)));
        }

        List<Publication> list = results == null ? List.of() : List.copyOf(results);
        int fromIndex = Math.min(page * size, list.size());
        int toIndex   = Math.min(fromIndex + size, list.size());

        return ResponseEntity.ok(
                list.subList(fromIndex, toIndex).stream()
                        .map(publicationService::convertToResponse)
                        .collect(Collectors.toList())
        );
    }

    // ══════════════════════ CHERCHEURS ══════════════════════

    /** GET /api/public/researchers */
    @GetMapping("/researchers")
    public List<ResearcherDTO> getAllResearchers() {
        return researcherService.getAllResearchers();
    }

    /** GET /api/public/researchers/{id} */
    @GetMapping("/researchers/{id}")
    public ResponseEntity<ResearcherDTO> getResearcherById(@PathVariable Long id) {
        return ResponseEntity.ok(researcherService.getResearcherById(id));
    }

    /**
     * GET /api/public/researchers/search?keyword=...&nom=...&domaine=...
     * keyword est un alias de nom pour compatibilité frontend.
     */
    @GetMapping("/researchers/search")
    public List<ResearcherDTO> searchResearchers(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String domaine) {

        String searchNom = (nom != null && !nom.isBlank()) ? nom : keyword;
        return researcherService.search(searchNom, null, domaine);
    }

    // ══════════════════════ DOMAINES ══════════════════════

    /** GET /api/public/domains */
    @GetMapping("/domains")
    public List<DomainDTO> getAllDomains() {
        return domainService.getAllDomains();
    }

    /** GET /api/public/domains/{id} */
    @GetMapping("/domains/{id}")
    public ResponseEntity<DomainDTO> getDomainById(@PathVariable Long id) {
        return ResponseEntity.ok(domainService.getDomainById(id));
    }

    /**
     * CORRECTION — Ajout de la recherche publique par domaine.
     * GET /api/public/domains/search?keyword=nlp
     */
    @GetMapping("/domains/search")
    public List<DomainDTO> searchDomains(@RequestParam String keyword) {
        return domainService.searchDomains(keyword);
    }

    // ══════════════════════ ACTUALITÉS ══════════════════════

    /**
     * GET /api/public/actualites — Uniquement les actualités actives,
     * accessibles sans authentification.
     */
    @GetMapping("/actualites")
    public List<ActualiteDTO> getActualitesActives() {
        return actualiteService.getAllActives();
    }

    // ══════════════════════ UTILITAIRE ══════════════════════

    private <T> Set<T> intersect(Set<T> base, Set<T> candidate) {
        if (base == null) return candidate;
        base.retainAll(candidate);
        return base;
    }
}