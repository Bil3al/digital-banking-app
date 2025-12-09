package com.example.demo.dtos;

import com.example.demo.entities.AccountStatus;
import lombok.Data;

import java.util.Date;


@Data
public class CurrentAccountDTO extends BankAccountDTO {
    private String id;
    private double balance;
    private Date createdAt;
    private AccountStatus status;
    private CustomerDTO customerDTO;
    private double overDraft;
}
