package com.jason.controller;

import java.util.HashSet;
import java.util.Set;
import javax.ws.rs.core.Application;
import org.eclipse.persistence.jaxb.rs.MOXyJsonProvider;

@javax.ws.rs.ApplicationPath("/resources")
public class AppRest extends Application {

    @Override
    public Set<Class<?>> getClasses() {
        Set<Class<?>> resources = new java.util.HashSet<>();
        // resources.add(MOXyJsonProvider.class);
        resources.add(ArticleResource.class);
        // addRestResourceClasses(resources);
        return resources;
    }

    @Override
    public Set<Object> getSingletons() {
        MOXyJsonProvider moxyJsonProvider = new MOXyJsonProvider();

        moxyJsonProvider.setAttributePrefix("@");
        moxyJsonProvider.setFormattedOutput(true);
        moxyJsonProvider.setIncludeRoot(false);
        moxyJsonProvider.setMarshalEmptyCollections(true);
        moxyJsonProvider.setValueWrapper("$");

        // Map<String, String> namespacePrefixMapper = new HashMap<String, String>(1);
        //    namespacePrefixMapper.put("http://www.example.org/customer", "cust");
        // moxyJsonProvider.setNamespacePrefixMapper(namespacePrefixMapper);
        moxyJsonProvider.setNamespaceSeparator(':');

        HashSet<Object> set = new HashSet<>(1);
        set.add(moxyJsonProvider);
        return set;
    }

    private void addRestResourceClasses(Set<Class<?>> resources) {
        resources.add(com.jason.controller.ArticleResource.class);
    }
}
