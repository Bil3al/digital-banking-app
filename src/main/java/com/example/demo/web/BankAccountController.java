package com.example.demo.web;

import com.example.demo.Exception.CustomerNotFoundException;
import com.example.demo.dtos.CurrentAccountDTO;
import com.example.demo.dtos.SavingAccountDTO;
import com.example.demo.services.BankAccountService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bankAccounts")
@AllArgsConstructor
@CrossOrigin("*")
public class BankAccountController {
    private BankAccountService bankAccountService;

    @PostMapping("/currentAccount")
    public CurrentAccountDTO saveCurrentBankAccount(
            @RequestParam double initialBalance,
            @RequestParam double overDraft,
            @RequestParam Long customerId) throws CustomerNotFoundException {
        return bankAccountService.saveCurrentBankAccount(initialBalance, overDraft, customerId);
    }

    @PostMapping("/savingAccount")
    public SavingAccountDTO saveSavingBankAccount(
            @RequestParam double initialBalance,
            @RequestParam double interestRate,
            @RequestParam Long customerId) throws CustomerNotFoundException {
        return bankAccountService.saveSavingBankAccount(initialBalance, interestRate, customerId);
    }
}

