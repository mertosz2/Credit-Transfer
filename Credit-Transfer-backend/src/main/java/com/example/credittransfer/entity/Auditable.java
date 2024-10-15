package com.example.credittransfer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@EntityListeners(AuditingEntityListener.class)
@MappedSuperclass
@Data
public class Auditable {

    @CreatedBy
    @ManyToOne
    @JoinColumn(name = "created_by" )
    @JsonIgnore
    private Users createdBy;

    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedBy
    @ManyToOne
    @JoinColumn(name = "last_modified_by" )
    @JsonIgnore
    private Users lastModifiedBy;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;
}
