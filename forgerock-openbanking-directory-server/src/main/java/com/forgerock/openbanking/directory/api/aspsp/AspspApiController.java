/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.api.aspsp;

import com.forgerock.openbanking.directory.config.Aspsp;
import com.forgerock.openbanking.directory.repository.AspspRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

@RestController
public class AspspApiController implements AspspApi {

    @Autowired
    private AspspRepository aspspRepository;

    @Override
    @RequestMapping(value = "/", method = RequestMethod.GET)
    public ResponseEntity<List<Aspsp>> getAllAspsp(
            Principal principal
    ) {
        return ResponseEntity.ok(aspspRepository.findAll());
    }

    @Override
    @RequestMapping(value = "/{aspspId}", method = RequestMethod.GET)
    public ResponseEntity getAspsp(
            @PathVariable String aspspId,
            Principal principal
    ) {
        Optional<Aspsp> isAspsp = aspspRepository.findById(aspspId);
        if (!isAspsp.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aspsp '" + aspspId + "' can't be found");
        }
        return ResponseEntity.ok(isAspsp.get());
    }


    @Override
    @RequestMapping(value = "/", method = RequestMethod.POST)
    public ResponseEntity<Aspsp> createAspsp(
            @RequestBody Aspsp aspsp,
            Principal principal
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aspspRepository.save(aspsp));
    }

    @Override
    @RequestMapping(value = "/{aspspId}", method = RequestMethod.PUT)
    public ResponseEntity updateAspsp(
            @PathVariable String aspspId,
            @RequestBody Aspsp aspsp,
            Principal principal
    ) {
        Optional<Aspsp> isAspsp = aspspRepository.findById(aspspId);
        if (!isAspsp.isPresent()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Aspsp '" + aspspId + "' can't be found");
        }
        aspsp.setId(aspspId);
        return ResponseEntity.ok(aspspRepository.save(aspsp));
    }
}
