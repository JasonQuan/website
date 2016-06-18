package com.jason.controller;

import com.jason.dao.ArticleDao;
import com.jason.entity.Article;
import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.xml.bind.JAXBException;

/**
 * REST Web Service
 *
 * @author jason
 * @TODO: request referrer 安全处理
 */
@Path("article")
public class ArticleResource {

    private final ArticleDao articleDao = new ArticleDao();
    private List<Article> articles;

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=GB2312")
    @Path("/list")
    public List<Article> getArticleList() throws JAXBException {
        if (articles == null) {
            articles = articleDao.getAll();
        }
        return articles;
    }

}
