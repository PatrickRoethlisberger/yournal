package main

import (
	"math/rand"
	"time"
)

//Define charset used for randomized string
const charset = "abcdefghijklmnopqrstuvwxyz" + "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"

var seededRand *rand.Rand

//StringWithCharset returns String with given Charset
func StringWithCharset(length int, charset string) string {
	b := make([]byte, length)
	//Get random number
	seededRand = rand.New(rand.NewSource(time.Now().UnixNano()))
	for i := range b {
		b[i] = charset[seededRand.Intn(len(charset))]
	}
	return string(b)
}

//String gives out random String with given length
func String(length int) string {
	return StringWithCharset(length, charset)
}
