/**
 * Copyright 2019 ForgeRock AS.
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
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
