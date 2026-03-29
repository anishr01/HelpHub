package com.helphub.services;

import com.helphub.models.HelpRequest;
import com.helphub.models.User;
import com.helphub.repositories.HelpRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HelpRequestService {

    @Autowired
    private HelpRequestRepository requestRepository;

    public List<HelpRequest> getAllRequests() {
        return requestRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<HelpRequest> getRequestsByType(String type) {
        return requestRepository.findByType(type);
    }

    public List<HelpRequest> getRequestsByRequester(Long requesterId) {
        return requestRepository.findByRequesterId(requesterId);
    }

    public List<HelpRequest> getRequestsByVolunteer(Long volunteerId) {
        return requestRepository.findByAcceptedById(volunteerId);
    }

    public Optional<HelpRequest> getRequestById(Long id) {
        return requestRepository.findById(id);
    }

    public HelpRequest createRequest(HelpRequest request, User requester) {
        request.setRequester(requester);
        return requestRepository.save(request);
    }

    public HelpRequest acceptRequest(Long requestId, User acceptedBy) {
        Optional<HelpRequest> optReq = requestRepository.findById(requestId);
        if (optReq.isPresent()) {
            HelpRequest req = optReq.get();
            req.setStatus("ACCEPTED");
            req.setAcceptedBy(acceptedBy);
            return requestRepository.save(req);
        }
        throw new RuntimeException("Request not found");
    }

    public HelpRequest updateStatus(Long requestId, String status) {
        Optional<HelpRequest> optReq = requestRepository.findById(requestId);
        if (optReq.isPresent()) {
            HelpRequest req = optReq.get();
            req.setStatus(status);
            return requestRepository.save(req);
        }
        throw new RuntimeException("Request not found");
    }
}
