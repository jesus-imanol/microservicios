package usecases

import (
	"backend_microservicios/src/post_couples/domain/entities"
	"backend_microservicios/src/post_couples/domain/repositories"
)

type GetPostsByTag struct {
	repository repositories.PostCouplesRepository
}

func NewGetPostsByTag(repository repositories.PostCouplesRepository) *GetPostsByTag {
	return &GetPostsByTag{
		repository: repository,
	}
}

func (g *GetPostsByTag) Execute(tag string) ([]*entities.PostCouple, error) {
	return g.repository.GetPostCouplesByTag(tag)
}
