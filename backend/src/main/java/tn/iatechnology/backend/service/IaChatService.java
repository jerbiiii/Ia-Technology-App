package tn.iatechnology.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class IaChatService {

    private static final Logger logger = LoggerFactory.getLogger(IaChatService.class);

    @Value("${ia.service.url:http://localhost:5000}")
    private String iaServiceUrl;

    @Autowired
    private PublicationService publicationService;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper()
            .registerModule(new JavaTimeModule())
            .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

    @SuppressWarnings("unchecked")
    public Map<String, Object> chat(Map<String, Object> body) {
        try {
            // Injecter les publications depuis la base de données
            List<?> publications = publicationService.getAllPublications();

            Map<String, Object> payload = new HashMap<>(body);
            payload.put("publications", publications);

            String jsonBody = objectMapper.writeValueAsString(payload);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            String url = iaServiceUrl + "/api/ia/chat";
            logger.info("Appel chat IA : {}", url);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return objectMapper.readValue(response.getBody(), Map.class);
            }

        } catch (Exception e) {
            logger.error("Erreur IaChatService : {}", e.getMessage());
        }

        // Fallback en cas d'erreur
        Map<String, Object> error = new HashMap<>();
        error.put("reply",       "Le service IA est momentanément indisponible.");
        error.put("results",     List.of());
        error.put("search_done", false);
        return error;
    }
    /**
     * Classifie automatiquement une publication dans un domaine de recherche.
     * Relaie vers POST /api/ia/classify du service Flask IA (port 5000).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> classify(Map<String, Object> body) {
        try {
            String jsonBody = objectMapper.writeValueAsString(body);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

            String url = iaServiceUrl + "/api/ia/classify";
            logger.info("Appel classification IA : {}", url);

            ResponseEntity<String> response = restTemplate.exchange(
                    url, HttpMethod.POST, entity, String.class
            );

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                return objectMapper.readValue(response.getBody(), Map.class);
            }

        } catch (Exception e) {
            logger.error("Erreur classify IaChatService : {}", e.getMessage());
        }

        Map<String, Object> error = new HashMap<>();
        error.put("error", "Le service de classification IA est indisponible.");
        return error;
    }

}