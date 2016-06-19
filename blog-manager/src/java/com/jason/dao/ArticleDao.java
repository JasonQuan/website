/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.jason.dao;

import com.jason.entity.Article;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.Query;

/**
 *
 * @author chenquan
 */
public class ArticleDao {

    private EntityManager em = null;

    public ArticleDao() {
        try {
            if (em == null) {
                EntityManagerFactory emf = Persistence.createEntityManagerFactory("website");
                em = emf.createEntityManager();
            }
            if (em == null) {
                throw new RuntimeException();
            }
        } catch (Exception e) {
            throw new RuntimeException(e.getLocalizedMessage());
        }
    }

    public List<Article> getAll() {
        return em.createQuery("select o from Article o", Article.class).getResultList();
    }

    public Article find(String id) {
        return em.createQuery("select o from Article o where o.id =:id", Article.class).setParameter("id", id).getSingleResult();
    }

    public void persist(Article article) {
        EntityTransaction transaction = em.getTransaction();
        transaction.begin();
        em.merge(article);
        transaction.commit();
    }

    public void remove(String id) {
        EntityTransaction transaction = em.getTransaction();
        transaction.begin();
        Query createQuery = em.createNativeQuery("delete from ARTICLE where ID = :id").setParameter("id", id);
        createQuery.executeUpdate();
        transaction.commit();
    }
}
