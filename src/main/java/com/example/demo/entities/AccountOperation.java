package com.example.demo.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.metamodel.model.domain.IdentifiableDomainType;

import java.util.Date;


@Entity
@NoArgsConstructor @AllArgsConstructor @Data
public class AccountOperation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date date;
    private  double amount;
    @Enumerated(EnumType.STRING)
    private  OperationType type;
    @ManyToOne
    private BankAccount bankAccount;
    private String description;
}
