package usecases

import (
	"backend_microservicios/src/post_couples/domain/repositories"
)

type IncrementLikesUseCase struct {
	repo repositories.PostCouplesRepository
}

func NewIncrementLikesUseCase(repo repositories.PostCouplesRepository) *IncrementLikesUseCase {
	return &IncrementLikesUseCase{repo: repo}
}

func (u *IncrementLikesUseCase) Execute(id int64) error {
	return u.repo.IncrementLikes(id)
}
