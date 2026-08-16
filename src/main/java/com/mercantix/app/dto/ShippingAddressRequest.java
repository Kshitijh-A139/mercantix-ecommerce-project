package com.mercantix.app.dto;

import jakarta.validation.constraints.Size;

/**
 * Structured shipping address. Persisted as JSON on the order so it survives a
 * round-trip even though the column is a single text field.
 */
public class ShippingAddressRequest {

    @Size(max = 200) private String fullName;
    @Size(max = 255) private String email;
    @Size(max = 255) private String line1;
    @Size(max = 120) private String city;
    @Size(max = 20)  private String postalCode;
    @Size(max = 120) private String country;

    public String getFullName()             { return fullName; }
    public void   setFullName(String v)     { this.fullName = v; }

    public String getEmail()                { return email; }
    public void   setEmail(String v)        { this.email = v; }

    public String getLine1()                { return line1; }
    public void   setLine1(String v)        { this.line1 = v; }

    public String getCity()                 { return city; }
    public void   setCity(String v)         { this.city = v; }

    public String getPostalCode()           { return postalCode; }
    public void   setPostalCode(String v)   { this.postalCode = v; }

    public String getCountry()              { return country; }
    public void   setCountry(String v)      { this.country = v; }
}
