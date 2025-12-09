package com.example.demo.repositories;

import com.example.demo.entities.AccountOperation;
import com.example.demo.entities.BankAccount;
import org.hibernate.query.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount , String> {
}
