/**
 * Copyright 2019 ForgeRock AS. All Rights Reserved
 *
 * Use of this code requires a commercial software license with ForgeRock AS.
 * or with one of its affiliates. All use shall be exclusively subject
 * to such license between the licensee and ForgeRock AS.
 */
package com.forgerock.openbanking.directory.ocsp;

public class OCSPValidationException extends Exception {

    private final CertificateStatus status;

    private OCSPValidationException(CertificateStatus status) {
        super(String.format("Invalid certificate status <%s> received", status));
        this.status = status;
    }

    public OCSPValidationException(Exception exception) {
        super(exception);
        this.status = CertificateStatus.ERROR;
    }

    public static OCSPValidationException of(CertificateStatus certificateStatus) {
        return new OCSPValidationException(certificateStatus);
    }

    public static OCSPValidationException of(Exception exception) {
        return new OCSPValidationException(exception);
    }

    /*
     * ACCESSORS
     */

    public CertificateStatus getStatus() {
        return status;
    }

}