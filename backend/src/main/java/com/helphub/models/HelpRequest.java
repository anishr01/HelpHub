package com.helphub.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "help_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HelpRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Type of request: "FOOD_CLOTHES", "BLOOD_MEDICINE", "ANIMAL_RESCUE"
    private String type;

    private String title;
    private String description;

    // Status: "PENDING", "ACCEPTED", "RESOLVED"
    private String status;

    private String location;
    private Double latitude;
    private Double longitude;
    private String imageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "requester_id")
    private User requester;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "accepted_by_id", nullable = true)
    private User acceptedBy;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING";
        }
    }
}
