package controllers

import (
	"backend_microservicios/src/post_couples/application/usecases"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type IncrementLikesController struct {
	useCase *usecases.IncrementLikesUseCase
}

func NewIncrementLikesController(useCase *usecases.IncrementLikesUseCase) *IncrementLikesController {
	return &IncrementLikesController{useCase: useCase}
}

func (c *IncrementLikesController) IncrementLikes(ctx *gin.Context) {
	// Obtener el ID del post desde los parámetros de la URL
	idParam := ctx.Param("id")
	id, err := strconv.ParseInt(idParam, 10, 64)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "ID inválido"})
		return
	}

	// Log para debug
	println("[IncrementLikes] ID recibido:", id)

	// Ejecutar el caso de uso
	if err := c.useCase.Execute(id); err != nil {
		println("[IncrementLikes] Error:", err.Error())
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Error al incrementar los me gusta"})
		return
	}

	println("[IncrementLikes] Éxito para ID:", id)
	ctx.JSON(http.StatusOK, gin.H{
		"message": "Me gusta incrementado exitosamente",
		"id":      id,
	})
}
