package com.example.demo.entities;

import jakarta.persistence.DiscriminatorColumn;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@DiscriminatorValue("CC")
@NoArgsConstructor
@AllArgsConstructor @Data
public class SavingAccount extends BankAccount{
    private double interestRate ;

}
