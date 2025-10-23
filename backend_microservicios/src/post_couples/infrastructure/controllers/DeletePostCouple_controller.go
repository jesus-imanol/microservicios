package controllers

import (
	"backend_microservicios/src/post_couples/application/usecases"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type DeletePostCoupleController struct {
	deletePostUseCase *usecases.DeletePostCouple
}

func NewDeletePostCoupleController(deletePostUseCase *usecases.DeletePostCouple) *DeletePostCoupleController {
	return &DeletePostCoupleController{
		deletePostUseCase: deletePostUseCase,
	}
}

func (dpc *DeletePostCoupleController) DeletePostCouple(g *gin.Context) {
	// Obtener el ID del path parameter
	idStr := g.Param("id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		g.JSON(http.StatusBadRequest, gin.H{"error": "invalid id format"})
		return
	}

	if err := dpc.deletePostUseCase.Execute(id); err != nil {
		g.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{
		"message": "Post eliminado exitosamente",
		"id":      id,
	}
	g.JSON(http.StatusOK, response)
}
