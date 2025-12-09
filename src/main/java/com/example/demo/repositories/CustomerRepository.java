package com.example.demo.repositories;

import com.example.demo.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer  , Long> {
    @Query("SELECT c from Customer c where c.name like: kw")
    List<Customer> searcheCustomer(@Param("kw") String keyword);
}
