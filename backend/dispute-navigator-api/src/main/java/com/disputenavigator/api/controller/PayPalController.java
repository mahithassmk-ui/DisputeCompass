
package com.disputenavigator.api.controller;

import com.disputenavigator.api.service.PayPalService;

import tools.jackson.databind.JsonNode;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/paypal")
@CrossOrigin(origins = {
        "http://localhost:4200",
        "http://127.0.0.1:4200"
})
public class PayPalController {

    private final PayPalService payPalService;

    public PayPalController(PayPalService payPalService) {
        this.payPalService = payPalService;
    }

    @GetMapping("/disputes")
    public JsonNode getDisputes() {
        return payPalService.getDisputes();
    }

    @GetMapping("/disputes/{disputeId}")
    public JsonNode getDisputeById(
            @PathVariable String disputeId) {

        return payPalService.getDisputeById(disputeId);
    }

    @GetMapping("/auth/callback")
    public ResponseEntity<String> paypalCallback(
            @RequestParam(required = false) String code,
            @RequestParam(required = false) String error) {

        if (error != null) {
            return ResponseEntity.badRequest()
                    .body("PayPal login was not completed: " + error);
        }

        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest()
                    .body("PayPal did not return an authorization code.");
        }

        return ResponseEntity.ok(
                "PayPal login callback received successfully. Authorization code received.");
    }
}
