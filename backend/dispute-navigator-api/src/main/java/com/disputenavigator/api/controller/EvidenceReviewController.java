package com.disputenavigator.api.controller;

import com.disputenavigator.api.service.EvidenceReviewService;
import com.disputenavigator.api.service.PayPalService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
public class EvidenceReviewController {

    private final PayPalService paypal;
    private final EvidenceReviewService review;

    public EvidenceReviewController(PayPalService paypal, EvidenceReviewService review) {
        this.paypal = paypal;
        this.review = review;
    }

    @PostMapping(value = "/disputes/{id}/evidence-review", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public EvidenceReviewService.Review review(@PathVariable String id,
            @RequestParam(defaultValue = "") String complaint,
            @RequestParam(defaultValue = "") String notes,
            @RequestParam(required = false) List<MultipartFile> files) {
        if (!id.matches("[A-Za-z0-9_-]{1,128}")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid dispute ID.");
        }
        return review.analyze(paypal.getDisputeById(id), complaint, notes,
                files == null ? List.of() : files);
    }
}
