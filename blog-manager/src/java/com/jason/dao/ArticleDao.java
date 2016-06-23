/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.jason.dao;

import com.jason.entity.Article;
import com.jason.entity.Category;
import java.util.List;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.Persistence;
import javax.persistence.Query;
import org.eclipse.persistence.config.CacheUsage;
import org.eclipse.persistence.config.QueryHints;

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
        Query createQuery = em.createNativeQuery("delete from ARTICLE where ID = ?").setParameter("1", id);
        createQuery.executeUpdate();
        transaction.commit();
    }

    public List<Category> getCategory() {
        em.getEntityManagerFactory().getCache().evict(Category.class);
        return em.createQuery("select o from Category o where o.parentCategory = null", Category.class)
                .setHint(QueryHints.CACHE_USAGE,CacheUsage.NoCache)
                .getResultList();
    }

    public Article getById(String id) {        
        return em.createQuery("select o from Article o where o.id =:id", Article.class).setParameter("id", id).getSingleResult();
    }

    public Article getIndexArticle() {
        return em.createQuery("select o from Article o where o.isTop = true order by o.updateTime", Article.class)
                .setMaxResults(1).setFirstResult(0)
                .getSingleResult();
    }
}
