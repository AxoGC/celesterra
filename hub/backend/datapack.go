package main

import (
	"encoding/json"
	"errors"
	"time"

	"gorm.io/gorm"
)

func ListDatapack(c *Context, u *struct{}, r *struct {
	Name   string   `form:"name"`
	UserID string   `form:"userId"`
	Tags   []string `form:"tags[]"`
}) (string, *List) {

	type User struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}

	type Tag struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Color string `json:"color"`
	}

	type Datapack struct {
		ID        string    `json:"id"`
		UpdatedAt time.Time `json:"updatedAt"`
		Name      string    `json:"name"`
		Profile   string    `json:"profile"`
		UserID    string    `json:"-"`
		User      User      `json:"user"`
		Tags      []Tag     `json:"tags" gorm:"many2many:datapack_tags"`
		UserCount uint      `json:"userCount"`
	}

	q := gorm.G[Datapack](c.DB).Table("datapacks d").Select(
		"*, (select count(*) from user_datapacks ud where ud.datapack_id = d.id) as user_count",
	)

	if r.Name != "" {
		q = q.Where("MATCH(name) AGAINST(?)", r.Name)
	}

	if r.Tags != nil {
		q = q.Where("id IN (?)", gorm.G[DatapackTag](c.DB).Select("datapack_id").Where("tag_id IN ?", r.Tags))
	}

	if r.UserID != "" {
		q = q.Where("user_id = ?", r.UserID)
	}

	total, err := q.Count(c, "*")
	if err != nil {
		c.Error(err)
		return "获取数据包总数失败", nil
	}

	datapacks, err := q.Preload("Tags", nil).Preload("User", nil).Find(c)
	if err != nil {
		c.Error(err)
		return "获取数据包列表失败", nil
	}

	return "", NewList(datapacks, total)
}

func GetDatapack(c *Context, u *struct {
	UserID string `uri:"userId"`
	ID     string `uri:"id"`
}, r *struct {
	Page int `json:"page"`
	Size int `json:"size"`
}) (string, any) {

	type User struct {
		ID   string `json:"id"`
		Name string `json:"name"`
	}

	type Version struct {
		ID         string          `json:"id"`
		CreatedAt  time.Time       `json:"createdAt"`
		Profile    string          `json:"profile"`
		DatapackID string          `json:"datapackId"`
		Data       json.RawMessage `json:"data"`
	}

	type Tag struct {
		ID    string `json:"id"`
		Name  string `json:"name"`
		Color string `json:"color"`
	}

	type Datapack struct {
		ID        string    `json:"id"`
		UserID    string    `json:"userId"`
		User      User      `json:"user"`
		CreatedAt time.Time `json:"createdAt"`
		UpdatedAt time.Time `json:"updatedAt"`
		Name      string    `json:"name"`
		Profile   string    `json:"profile"`
		Tags      []Tag     `json:"tags"`
		UserCount uint      `json:"userCount"`
		Versions  []Version `json:"versions"`
	}

	datapack, err := gorm.G[Datapack](c.DB).Preload(
		"Tags", nil,
	).Preload(
		"User", nil,
	).Preload(
		"Versions", func(db gorm.PreloadBuilder) error {
			db.Offset((r.Page - 1) * r.Size).Limit(r.Size)
			return nil
		},
	).Where("user_id = ? AND datapack_id = ?", u.UserID, u.ID).Find(c)
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return "找不到这个数据包", nil
	} else if err != nil {
		c.Error(err)
		return "获取数据包失败", nil
	}

	return "", datapack
}
