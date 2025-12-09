package com.example.demo.repositories;

import com.example.demo.entities.AccountOperation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountOperationRepository extends JpaRepository<AccountOperation, Long> {
    List<AccountOperation> findByBankAccountIdOrderByDateDesc(String accountId);
    Page<AccountOperation> findByBankAccountIdOrderByDateDesc(String accountId, Pageable pageable);
}
