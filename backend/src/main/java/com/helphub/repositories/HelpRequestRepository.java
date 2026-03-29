package com.helphub.repositories;

import com.helphub.models.HelpRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HelpRequestRepository extends JpaRepository<HelpRequest, Long> {
    List<HelpRequest> findByType(String type);
    List<HelpRequest> findByStatus(String status);
    List<HelpRequest> findByRequesterId(Long requesterId);
    List<HelpRequest> findByAcceptedById(Long acceptedById);
    List<HelpRequest> findAllByOrderByCreatedAtDesc();
}
