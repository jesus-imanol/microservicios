package usecases

import (
	"backend_microservicios/src/post_couples/domain/entities"
	"backend_microservicios/src/post_couples/domain/repositories"
	"errors"
)

type CreatePostCouples struct {
	db repositories.PostCouplesRepository
}

func NewCreatePostCouples(db repositories.PostCouplesRepository) *CreatePostCouples {
	return &CreatePostCouples{db: db}
}

func (uc *CreatePostCouples) Execute(postCouple *entities.PostCouple) error {
	if postCouple.Contenido == "" {
		return errors.New("el contenido no puede estar vacío")
	}
	return uc.db.CreatePostCouples(postCouple)
}