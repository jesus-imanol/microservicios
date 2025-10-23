package controllers

import (
	"backend_microservicios/src/post_couples/application/usecases"
	"net/http"

	"github.com/gin-gonic/gin"
)

type GetPostsByTagController struct {
	getPostsByTagUseCase *usecases.GetPostsByTag
}

func NewGetPostsByTagController(getPostsByTagUseCase *usecases.GetPostsByTag) *GetPostsByTagController {
	return &GetPostsByTagController{
		getPostsByTagUseCase: getPostsByTagUseCase,
	}
}

func (gptc *GetPostsByTagController) GetPostsByTag(g *gin.Context) {
	tag := g.Param("tag")
	if tag == "" {
		g.JSON(http.StatusBadRequest, gin.H{"error": "tag parameter is required"})
		return
	}

	posts, err := gptc.getPostsByTagUseCase.Execute(tag)
	if err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{
		"data": posts,
	}
	g.JSON(http.StatusOK, response)
}
