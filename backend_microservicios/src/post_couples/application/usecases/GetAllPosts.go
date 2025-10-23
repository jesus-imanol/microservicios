package usecases

import (
	"backend_microservicios/src/post_couples/domain/entities"
	"backend_microservicios/src/post_couples/domain/repositories"
)

type GetAllPosts struct {
	repository repositories.PostCouplesRepository
}

func NewGetAllPosts(repository repositories.PostCouplesRepository) *GetAllPosts {
	return &GetAllPosts{
		repository: repository,
	}
}

func (g *GetAllPosts) Execute() ([]*entities.PostCouple, error) {
	return g.repository.GetAllPostCouples()
}
