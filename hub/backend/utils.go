package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Context struct {
	DB *gorm.DB
	*gin.Context
}

type List struct {
	Data  any   `json:"data"`
	Total int64 `json:"total"`
}

func NewList(data any, total int64) *List {
	return &List{Data: data, Total: total}
}

func Paginate(page, size int) func(db *gorm.Statement) {
	return func(db *gorm.Statement) {
		db.Offset((page - 1) * size).Limit(size)
	}
}
