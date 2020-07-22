/*
 * Yournal API
 *
 * Documentation and definition of the Yournal API  # Authentication  <!-- ReDoc-Inject: <security-definitions> -->
 *
 * API version: 0.1.0
 * Contact: hi@yournal.tk
 * Generated by: OpenAPI Generator (https://openapi-generator.tech)
 */

package main

type User struct {

	// User email provided by oAuth Provider
	Email string `json:"email"`

	OAuthType string `json:"oAuthType"`

	// oAuth ID provided by oAuth Provider
	OAuthID string `json:"oAuthID"`

	// User chosen username
	Username string `json:"username,omitempty"`

	// User chosen profileimage
	Image string `json:"image,omitempty"`
}
