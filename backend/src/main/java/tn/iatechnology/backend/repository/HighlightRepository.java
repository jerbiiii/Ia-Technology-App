package tn.iatechnology.backend.repository;

import tn.iatechnology.backend.entity.Highlight;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface HighlightRepository extends JpaRepository<Highlight, Long> {
    List<Highlight> findByActifTrueOrderByDateCreationDesc();
}