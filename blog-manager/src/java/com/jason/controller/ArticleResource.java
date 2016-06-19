package com.jason.controller;

import com.jason.dao.ArticleDao;
import com.jason.entity.Article;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
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

    @GET
    @Path("/remove/{aid}")
    public void removeArticle(@javax.ws.rs.PathParam("aid") String id) throws JAXBException {
        articleDao.remove(id);
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON + ";charset=GB2312")
    @Consumes(MediaType.APPLICATION_JSON + ";charset=GB2312")
    @Path("/update/")
    public Response updateArticle(Article article) throws JAXBException {
        if (article.getId() != null && article.getId().length() > 0) {
            article.setUpdateTime(new Date());
        } else {
            article.setId(UUID.randomUUID().toString());
            article.setCreateTime(new Date());
        }
        articleDao.persist(article);
        return Response.status(Response.Status.OK).entity(article.getId()).build();
    }

}
