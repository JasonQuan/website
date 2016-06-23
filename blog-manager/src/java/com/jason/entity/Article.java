/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.jason.entity;

import java.io.Serializable;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Lob;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.xml.bind.annotation.XmlRootElement;

/**
 *
 * @author chenquan
 */
@Entity
@Table(name = "ARTICLE")
@XmlRootElement
@NamedQueries({
    @NamedQuery(name = "ARTICLE.findAll", query = "SELECT a FROM ARTICLE a"),
    @NamedQuery(name = "ARTICLE.findById", query = "SELECT a FROM ARTICLE a WHERE a.id = :id"),
    @NamedQuery(name = "ARTICLE.findByTitle", query = "SELECT a FROM ARTICLE a WHERE a.title = :title"),
    @NamedQuery(name = "ARTICLE.findByShortName", query = "SELECT a FROM ARTICLE a WHERE a.shortName = :shortName"),
    @NamedQuery(name = "ARTICLE.findByAuthor", query = "SELECT a FROM ARTICLE a WHERE a.author = :author"),
    @NamedQuery(name = "ARTICLE.findBySort", query = "SELECT a FROM ARTICLE a WHERE a.sort = :sort"),
    @NamedQuery(name = "ARTICLE.findByUpdateTime", query = "SELECT a FROM ARTICLE a WHERE a.updateTime = :updateTime"),
    @NamedQuery(name = "ARTICLE.findByVersion", query = "SELECT a FROM ARTICLE a WHERE a.version = :version"),
    @NamedQuery(name = "ARTICLE.findByCreateTime", query = "SELECT a FROM ARTICLE a WHERE a.createTime = :createTime"),
    @NamedQuery(name = "ARTICLE.findByStatus", query = "SELECT a FROM ARTICLE a WHERE a.status = :status")})
public class Article implements Serializable {

    private static final long serialVersionUID = 1L;
    @Id
    @Basic(optional = false)
    @NotNull
    @Size(min = 1, max = 45)
    @Column(name = "ID")
    private String id;
    @Size(max = 45)
    @Column(name = "TITLE")
    private String title;
    @Size(max = 50)
    @Column(name = "SHORT_NAME")
    private String shortName;
    @Lob
    @Size(max = 65535)
    @Column(name = "CONTENT")
    private String content;
    @Size(max = 50)
    @Column(name = "AUTHOR")
    private String author;
    @Size(max = 45)
    @Column(name = "SORT")
    private String sort;
    @Column(name = "UPDATE_TIME")
    @Temporal(TemporalType.TIMESTAMP)
    private Date updateTime;
    @Column(name = "VERSION")
    private Integer version;
    @Column(name = "IS_TOP")
    private Boolean isTop;
    @Column(name = "CREATE_TIME")
    @Temporal(TemporalType.TIMESTAMP)
    private Date createTime;
    @Size(max = 45)
    @Column(name = "STATUS")
    private String status;
    @JoinColumn(name = "CATEGORY_ID", referencedColumnName = "ID")
    @ManyToOne(cascade = CascadeType.PERSIST)
    private Category category;
    @Transient
    private String token;

    public Article() {
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Boolean getIsTop() {
        return isTop;
    }

    public void setIsTop(Boolean isTop) {
        this.isTop = isTop;
    }

    public Article(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getSort() {
        return sort;
    }

    public void setSort(String sort) {
        this.sort = sort;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category categoryId) {
        this.category = categoryId;
    }

    @Override
    public int hashCode() {
        int hash = 0;
        hash += (id != null ? id.hashCode() : 0);
        return hash;
    }

    @Override
    public boolean equals(Object object) {
        // TODO: Warning - this method won't work in the case the id fields are not set
        if (!(object instanceof Article)) {
            return false;
        }
        Article other = (Article) object;
        if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "com.jason.entity.ARTICLE[ id=" + id + " ]";
    }
    
}
