package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type PersonalInfoController struct{}

func NewPersonalInfoController() *PersonalInfoController {
	return &PersonalInfoController{}
}

// GetFullName retorna el nombre completo del creador
// Endpoint: GET /avendano
func (c *PersonalInfoController) GetFullName(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"nombre_completo": "Jesús Imanol Castillo Avendaño",
		"mensaje":         "Creador del sistema de microservicios CouplesApp",
		"fecha":           "2025",
	})
}
