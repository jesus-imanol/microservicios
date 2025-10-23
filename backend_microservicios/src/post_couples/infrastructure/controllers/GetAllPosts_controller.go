package controllers

import (
	"backend_microservicios/src/post_couples/application/usecases"
	"net/http"

	"github.com/gin-gonic/gin"
)

type GetAllPostsController struct {
	getAllPostsUseCase *usecases.GetAllPosts
}

func NewGetAllPostsController(getAllPostsUseCase *usecases.GetAllPosts) *GetAllPostsController {
	return &GetAllPostsController{
		getAllPostsUseCase: getAllPostsUseCase,
	}
}

func (gpc *GetAllPostsController) GetAllPosts(g *gin.Context) {
	posts, err := gpc.getAllPostsUseCase.Execute()
	if err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{
		"data": posts,
	}
	g.JSON(http.StatusOK, response)
}
