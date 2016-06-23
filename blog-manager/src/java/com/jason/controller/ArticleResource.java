package com.jason.controller;

import com.jason.dao.ArticleDao;
import com.jason.entity.Article;
import com.jason.entity.Category;
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
    private List<Category> Categorys;

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=GB2312")
    @Path("/category")
    public List<Category> getArticleCategory() throws JAXBException {
        if (Categorys == null) {
            Categorys = articleDao.getCategory();
        }
        return Categorys;
    }

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
    @Produces(MediaType.APPLICATION_JSON + ";charset=GB2312")
    @Path("/article/{id}")
    public Article getArticleById(@javax.ws.rs.PathParam("id") String id) throws JAXBException {
        return articleDao.getById(id);
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON + ";charset=GB2312")
    @Path("/index/")
    public Article getArticleIndex() throws JAXBException {
        return articleDao.getIndexArticle();
    }

    @GET
    @Path("/remove/{aid}/{token}")
    public void removeArticle(@javax.ws.rs.PathParam("aid") String id, @javax.ws.rs.PathParam("token") String token) throws JAXBException {
        //TODO: check token

        articleDao.remove(id);
    }

    @GET
    @Path("/login/{id}/{ps}")
    public Response login(@javax.ws.rs.PathParam("id") String id, @javax.ws.rs.PathParam("ps") String ps) throws JAXBException {
        if (id != null && "admin".equals(id)) {
            return Response.status(Response.Status.OK).entity("{\"session\":\"session uuid\",\"sc1\":\"<script src='ckeditor/ckeditor.js'></script>\",\"sc2\":\"<script src='editor.js'></script>\",\"ps\":\"head\",\"eval\":\"initLogin()\"}").build();
        }
        return Response.status(Response.Status.NOT_FOUND).entity("").build();
    }

    @POST
    @Produces(MediaType.APPLICATION_JSON + ";charset=GB2312")
    @Consumes(MediaType.APPLICATION_JSON + ";charset=GB2312")
    @Path("/update/")
    public Response updateArticle(Article article) throws JAXBException {
        //TODO: check token
        if (article.getToken() == null) {
            return Response.status(Response.Status.BAD_REQUEST).entity("请登录后再操作").build();
        }
        if (article.getId() == null || article.getId().length() == 0) {
            article.setId(UUID.randomUUID().toString());
            article.setCreateTime(new Date());
        }
        article.setUpdateTime(new Date());
        articleDao.persist(article);
        return Response.status(Response.Status.OK).entity(article.getId()).build();
    }

}
