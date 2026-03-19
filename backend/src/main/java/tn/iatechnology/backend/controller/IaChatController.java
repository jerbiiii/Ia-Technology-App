package tn.iatechnology.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tn.iatechnology.backend.service.IaChatService;

import java.util.Map;


@RestController
@RequestMapping("/api/public/ia")
public class IaChatController {

    @Autowired
    private IaChatService iaChatService;

    /**
     * POST /api/public/ia/chat
     * Accessible sans authentification.
     */
    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> chat(@RequestBody Map<String, Object> body) {
        if (body == null || !body.containsKey("message")) {
            return ResponseEntity.badRequest().build();
        }
        Map<String, Object> result = iaChatService.chat(body);
        return ResponseEntity.ok(result);
    }
    /**
     * POST /api/public/ia/classify
     * Classifie automatiquement une publication dans un domaine de recherche.
     * Accessible sans authentification.
     */
    @PostMapping("/classify")
    public ResponseEntity<Map<String, Object>> classify(@RequestBody Map<String, Object> body) {
        if (body == null || !body.containsKey("titre")) {
            return ResponseEntity.badRequest().build();
        }
        Map<String, Object> result = iaChatService.classify(body);
        return ResponseEntity.ok(result);
    }

}