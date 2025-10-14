package main

import (
	"encoding/json"
	"time"
)

var Tables = []any{new(User), new(Datapack), new(VersionStatus), new(Version), new(UserDatapack), new(Tag), new(DatapackTag)}

type User struct {
	ID        string    `gorm:"type:VARBINARY(16);primarykey;comment:标识"`
	CreatedAt time.Time `gorm:"not null;comment:创建时间"`
	UpdatedAt time.Time `gorm:"not null;comment:更新时间"`
	Name      string    `gorm:"type:VARCHAR(50);not null;index:,class:FULLTEXT,option:WITH PARSER ngram;comment:名称"`
	Email     string    `gorm:"type:VARCHAR(100);not null;comment:邮箱"`
}

type Datapack struct {
	ID        string    `gorm:"type:VARBINARY(16);primarykey;comment:标识"`
	AuthorID  string    `gorm:"type:VARBINARY(16);primarykey;comment:作者标识"`
	Author    User      `gorm:"constraint:OnDelete:CASCADE"`
	CreatedAt time.Time `gorm:"not null;comment:创建时间"`
	UpdatedAt time.Time `gorm:"not null;comment:更新时间"`
	Name      string    `gorm:"type:VARCHAR(100);not null;index:,class:FULLTEXT,option:WITH PARSER ngram;comment:名称"`
	Profile   string    `gorm:"type:TEXT;not null;comment:简介"`
}

type VersionStatus struct {
	ID    string `gorm:"type:VARBINARY(16);primarykey;comment:标识"`
	Name  string `gorm:"type:VARCHAR(50);not null;comment:名称"`
	Color string `gorm:"type:VARBINARY(16);not null;comment:颜色"`
}

type Version struct {
	ID         string          `gorm:"type:VARBINARY(16);primarykey;comment:标识"`
	DatapackID string          `gorm:"type:VARBINARY(16);primarykey;comment:数据包标识"`
	Datapack   Datapack        `gorm:"constraint:OnDelete:CASCADE"`
	AuthorID   string          `gorm:"type:VARBINARY(16);primarykey;comment:作者标识"`
	Author     User            `gorm:"constraint:OnDelete:CASCADE"`
	CreatedAt  time.Time       `gorm:"not null;comment:创建时间"`
	StatusID   string          `gorm:"type:VARBINARY(16);not null;index;comment:状态标识"`
	Status     VersionStatus   `gorm:"constraint:OnDelete:RESTRICT"`
	Profile    string          `gorm:"type:TEXT;not null;comment:简介"`
	Data       json.RawMessage `gorm:"type:JSON;not null;comment:数据"`
}

type UserDatapack struct {
	LikerID    string   `gorm:"type:VARBINARY(16);primarykey;comment:喜欢者标识"`
	Liker      User     `gorm:"constraint:OnDelete:CASCADE"`
	AuthorID   string   `gorm:"type:VARBINARY(16);primarykey;comment:作者标识"`
	Author     User     `gorm:"constraint:OnDelete:CASCADE"`
	DatapackID string   `gorm:"type:VARBINARY(16);primarykey;comment:数据包标识"`
	Datapack   Datapack `gorm:"constraint:OnDelete:CASCADE"`
}

type Tag struct {
	ID    string `gorm:"type:VARBINARY(16);primarykey;comment:标识"`
	Name  string `gorm:"type:VARCHAR(50);not null;comment:名称"`
	Color string `gorm:"type:VARBINARY(16);not null;comment:颜色"`
}

type DatapackTag struct {
	AuthorID   string   `gorm:"type:VARBINARY(16);primarykey;comment:作者标识"`
	Author     User     `gorm:"constraint:OnDelete:CASCADE"`
	DatapackID string   `gorm:"type:VARBINARY(16);primarykey;comment:数据包标识"`
	Datapack   Datapack `gorm:"constraint:OnDelete:CASCADE"`
	TagID      string   `gorm:"type:VARBINARY(16);primarykey;comment:标签标识"`
	Tag        Tag      `gorm:"constraint:OnDelete:CASCADE"`
}
