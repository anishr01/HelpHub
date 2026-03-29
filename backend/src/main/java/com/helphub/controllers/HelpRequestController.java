package com.helphub.controllers;

import com.helphub.models.HelpRequest;
import com.helphub.models.User;
import com.helphub.services.HelpRequestService;
import com.helphub.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
public class HelpRequestController {

    @Autowired
    private HelpRequestService requestService;

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<List<HelpRequest>> getAllRequests(@RequestParam(required = false) String type) {
        if (type != null && !type.isEmpty()) {
            return ResponseEntity.ok(requestService.getRequestsByType(type));
        }
        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @PostMapping
    public ResponseEntity<?> createRequest(@RequestBody HelpRequest request, @RequestParam Long requesterId) {
        Optional<User> requester = userService.getUserById(requesterId);
        if (requester.isEmpty()) {
            return ResponseEntity.badRequest().body("Requester not found");
        }
        HelpRequest createdRequest = requestService.createRequest(request, requester.get());
        return ResponseEntity.ok(createdRequest);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable Long id, @RequestParam Long volunteerId) {
        Optional<User> volunteer = userService.getUserById(volunteerId);
        if (volunteer.isEmpty()) {
            return ResponseEntity.badRequest().body("Volunteer not found");
        }
        try {
            HelpRequest updatedReq = requestService.acceptRequest(id, volunteer.get());
            return ResponseEntity.ok(updatedReq);
        } catch(RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            HelpRequest updatedReq = requestService.updateStatus(id, status);
            return ResponseEntity.ok(updatedReq);
        } catch(RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{requesterId}")
    public ResponseEntity<List<HelpRequest>> getRequestsByUser(@PathVariable Long requesterId) {
        return ResponseEntity.ok(requestService.getRequestsByRequester(requesterId));
    }

    @GetMapping("/volunteer/{volunteerId}")
    public ResponseEntity<List<HelpRequest>> getRequestsByVolunteer(@PathVariable Long volunteerId) {
        return ResponseEntity.ok(requestService.getRequestsByVolunteer(volunteerId));
    }
}
