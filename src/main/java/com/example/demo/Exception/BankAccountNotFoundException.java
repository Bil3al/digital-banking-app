package com.example.demo.Exception;

public class BankAccountNotFoundException extends Throwable {
    public BankAccountNotFoundException(String message) {
        super(message);
    }
}
