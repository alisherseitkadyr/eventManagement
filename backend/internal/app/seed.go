package app

import (
	"time"

	"event/internal/events"
	"event/internal/guests"
	"event/internal/stages"
	"event/internal/templates"

	"github.com/lib/pq"
)

func seedDemoData(
	eventRepo events.Repository,
	guestRepo guests.Repository,
	stageRepo stages.Repository,
) error {
	existing, err := eventRepo.GetByID("evt_001")
	if err != nil {
		return err
	}
	if existing != nil {
		return nil
	}

	createdAt := mustTime("2026-01-15T10:00:00Z")
	updatedAt := mustTime("2026-04-08T14:30:00Z")

	event := &events.Event{
		ID:               "evt_001",
		Type:             "wedding",
		TemplateStyle:    "elegant",
		Languages:        pq.StringArray{"ru", "kz"},
		AccentColor:      "#7A2E3A",
		TitleRu:          "Свадьба Айданы & Нурлана",
		TitleKz:          "Айдана мен Нұрланның тойы",
		SubtitleRu:       "Приглашение",
		SubtitleKz:       "Шақыру",
		DescriptionRu:    "Мы рады пригласить вас на самый важный день в нашей жизни. Будем счастливы разделить этот праздник вместе с вами.",
		DescriptionKz:    "Біз сізді өміріміздегі ең маңызды күнге шақыруға қуаныштымыз. Бұл мерекені сіздермен бірге бөлісуге қуаныштымыз.",
		DressCodeRu:      "Пастельные тона, без белого",
		DressCodeKz:      "Пастель түстер, ақсыз",
		GiftWishesRu:     "Ваше присутствие — лучший подарок",
		GiftWishesKz:     "Сіздің қатысуыңыз — ең жақсы сыйлық",
		CoordinatorName:  "Айгерим Касымова",
		CoordinatorPhone: "+7 701 123 45 67",
		Published:        true,
		CreatedAt:        createdAt,
		UpdatedAt:        updatedAt,
	}

	if err := eventRepo.Create(event); err != nil {
		return err
	}

	seededStages := []*stages.Stage{
		{
			ID:        "stg_1",
			EventID:   event.ID,
			NameRu:    "Қыз ұзату",
			NameKz:    "Қыз ұзату",
			Date:      "2026-07-14",
			Time:      "12:00",
			Place:     "Ресторан \"Алтын Ғасыр\"",
			Address:   "ул. Абая 52, Алматы",
			Emoji:     "👰",
			SortOrder: 1,
			CreatedAt: createdAt,
			UpdatedAt: updatedAt,
		},
		{
			ID:        "stg_2",
			EventID:   event.ID,
			NameRu:    "Неке қию",
			NameKz:    "Неке қию",
			Date:      "2026-07-15",
			Time:      "15:00",
			Place:     "Мечеть Хазрет Султан",
			Address:   "пр. Тәуелсіздік 48, Астана",
			Emoji:     "🕌",
			SortOrder: 2,
			CreatedAt: createdAt,
			UpdatedAt: updatedAt,
		},
		{
			ID:        "stg_3",
			EventID:   event.ID,
			NameRu:    "Основной той",
			NameKz:    "Негізгі той",
			Date:      "2026-07-15",
			Time:      "18:00",
			Place:     "Банкетный зал \"Достар\"",
			Address:   "пр. Кабанбай батыра 11, Астана",
			Emoji:     "🎉",
			SortOrder: 3,
			CreatedAt: createdAt,
			UpdatedAt: updatedAt,
		},
	}

	for _, stage := range seededStages {
		if err := stageRepo.Create(stage); err != nil {
			return err
		}
	}

	openedOne := mustTime("2026-03-28T09:00:00Z")
	respondedOne := mustTime("2026-04-01T10:00:00Z")
	openedTwo := mustTime("2026-04-01T12:00:00Z")
	respondedTwo := mustTime("2026-04-02T15:00:00Z")
	openedFour := mustTime("2026-04-02T09:00:00Z")
	respondedFour := mustTime("2026-04-03T10:00:00Z")
	openedFive := mustTime("2026-04-04T11:00:00Z")
	respondedFive := mustTime("2026-04-05T16:00:00Z")
	openedSix := mustTime("2026-03-29T07:00:00Z")
	respondedSix := mustTime("2026-03-30T08:00:00Z")
	openedEight := mustTime("2026-04-05T10:00:00Z")
	respondedEight := mustTime("2026-04-06T12:00:00Z")
	openedTen := mustTime("2026-04-06T08:00:00Z")
	respondedTen := mustTime("2026-04-07T09:00:00Z")

	seededGuests := []*guests.Guest{
		{ID: "g1", EventID: event.ID, Name: "Семья Нургалиевых", Count: 4, Side: "bride", Category: "family", Status: "confirmed", Phone: "+7 701 123 4567", Token: "nurgali", IsVip: true, AssignedStageIDs: pq.StringArray{"stg_1", "stg_2", "stg_3"}, HasChildren: true, RespondedAt: &respondedOne, OpenedAt: &openedOne, CreatedAt: createdAt, UpdatedAt: updatedAt},
		{ID: "g2", EventID: event.ID, Name: "Ержан Касымов", Count: 1, Side: "groom", Category: "friends", Status: "confirmed", Phone: "+7 702 234 5678", Token: "erzhan", AssignedStageIDs: pq.StringArray{"stg_3"}, RespondedAt: &respondedTwo, OpenedAt: &openedTwo, CreatedAt: createdAt, UpdatedAt: updatedAt},
		{ID: "g3", EventID: event.ID, Name: "Семья Байтурсыновых", Count: 3, Side: "bride", Category: "relatives", Status: "pending", Phone: "+7 707 345 6789", Token: "baitur", IsElder: true, AssignedStageIDs: pq.StringArray{"stg_1", "stg_2", "stg_3"}, CreatedAt: createdAt, UpdatedAt: updatedAt},
		{ID: "g4", EventID: event.ID, Name: "Дана и Арман Сагиновы", Count: 2, Side: "common", Category: "friends", Status: "declined", Phone: "+7 700 456 7890", Token: "sagino", AssignedStageIDs: pq.StringArray{"stg_3"}, Comment: "К сожалению, будем в отпуске", RespondedAt: &respondedFour, OpenedAt: &openedFour, CreatedAt: createdAt, UpdatedAt: updatedAt},
		{ID: "g5", EventID: event.ID, Name: "Бауыржан Омаров", Count: 1, Side: "groom", Category: "colleagues", Status: "maybe", Phone: "+7 705 567 8901", Token: "bauyrzh", AssignedStageIDs: pq.StringArray{"stg_3"}, RespondedAt: &respondedFive, OpenedAt: &openedFive, CreatedAt: createdAt, UpdatedAt: updatedAt},
		{ID: "g6", EventID: event.ID, Name: "Семья Алдабергеновых", Count: 5, Side: "bride", Category: "relatives", Status: "confirmed", Phone: "+7 708 678 9012", Token: "aldabe", IsVip: true, IsElder: true, HasChildren: true, AssignedStageIDs: pq.StringArray{"stg_1", "stg_2", "stg_3"}, RespondedAt: &respondedSix, OpenedAt: &openedSix, CreatedAt: createdAt, UpdatedAt: updatedAt},
		{ID: "g7", EventID: event.ID, Name: "Мадина Ахметова", Count: 1, Side: "common", Category: "friends", Status: "pending", Phone: "+7 701 789 0123", Token: "madina", AssignedStageIDs: pq.StringArray{"stg_3"}, CreatedAt: createdAt, UpdatedAt: updatedAt},
		{ID: "g8", EventID: event.ID, Name: "Семья Токтаровых", Count: 3, Side: "groom", Category: "family", Status: "confirmed", Phone: "+7 776 890 1234", Token: "toktar", IsVip: true, HasChildren: true, AssignedStageIDs: pq.StringArray{"stg_2", "stg_3"}, RespondedAt: &respondedEight, OpenedAt: &openedEight, CreatedAt: createdAt, UpdatedAt: updatedAt},
		{ID: "g9", EventID: event.ID, Name: "Асель Жумабаева", Count: 2, Side: "bride", Category: "friends", Status: "pending", Phone: "+7 747 901 2345", Token: "aselzh", AssignedStageIDs: pq.StringArray{"stg_1", "stg_3"}, CreatedAt: createdAt, UpdatedAt: updatedAt},
		{ID: "g10", EventID: event.ID, Name: "Тимур Сейтказин", Count: 1, Side: "groom", Category: "colleagues", Status: "confirmed", Phone: "+7 702 012 3456", Token: "timurs", AssignedStageIDs: pq.StringArray{"stg_3"}, RespondedAt: &respondedTen, OpenedAt: &openedTen, CreatedAt: createdAt, UpdatedAt: updatedAt},
	}

	for _, guest := range seededGuests {
		if err := guestRepo.Create(guest); err != nil {
			return err
		}
	}

	return nil
}

func mustTime(value string) time.Time {
	parsed, err := time.Parse(time.RFC3339, value)
	if err != nil {
		panic(err)
	}

	return parsed
}

func seedTemplates(templateRepo templates.Repository) error {
	now := mustTime("2026-01-10T10:00:00Z")

	templatesData := []*templates.Template{
		{
			ID:              "tpl_001",
			Name:            "Elegant Wedding",
			Type:            "wedding",
			TemplateStyle:   "elegant",
			AccentColor:     "#7A2E3A",
			Languages:       []string{"ru", "kz"},
			PreviewImageURL: "/templates/elegant.jpg",
			IsActive:        true,
			SortOrder:       1,
			CreatedAt:       now,
			UpdatedAt:       now,
			Blocks: []templates.TemplateBlock{
				{BlockID: "cover", Label: "Cover Image", Enabled: true, SortOrder: 1, Settings: map[string]interface{}{
					"height":  300,
					"overlay": "rgba(0,0,0,0.3)",
				}},
				{BlockID: "title", Label: "Title", Enabled: true, SortOrder: 2, Settings: map[string]interface{}{
					"fontSize": 36,
					"align":    "center",
				}},
			},
		},

		{
			ID:              "tpl_002",
			Name:            "Modern Minimal",
			Type:            "universal",
			TemplateStyle:   "minimal",
			AccentColor:     "#111111",
			Languages:       []string{"ru", "kz"},
			PreviewImageURL: "/templates/minimal.jpg",
			IsActive:        true,
			SortOrder:       2,
			CreatedAt:       now,
			UpdatedAt:       now,
		},

		{
			ID:              "tpl_003",
			Name:            "Kazakh Traditional",
			Type:            "wedding",
			TemplateStyle:   "traditional",
			AccentColor:     "#C9A227",
			Languages:       []string{"kz", "ru"},
			PreviewImageURL: "/templates/kazakh.jpg",
			IsActive:        true,
			SortOrder:       3,
			CreatedAt:       now,
			UpdatedAt:       now,
		},

		{
			ID:              "tpl_004",
			Name:            "Dark Luxury",
			Type:            "wedding",
			TemplateStyle:   "dark",
			AccentColor:     "#D4AF37",
			Languages:       []string{"ru"},
			PreviewImageURL: "/templates/dark.jpg",
			IsActive:        true,
			SortOrder:       4,
			CreatedAt:       now,
			UpdatedAt:       now,
		},

		{
			ID:              "tpl_005",
			Name:            "Birthday Fun",
			Type:            "birthday",
			TemplateStyle:   "colorful",
			AccentColor:     "#FF6B6B",
			Languages:       []string{"ru"},
			PreviewImageURL: "/templates/birthday.jpg",
			IsActive:        true,
			SortOrder:       5,
			CreatedAt:       now,
			UpdatedAt:       now,
		},

		{
			ID:              "tpl_006",
			Name:            "Corporate Clean",
			Type:            "corporate",
			TemplateStyle:   "clean",
			AccentColor:     "#2563EB",
			Languages:       []string{"ru", "en"},
			PreviewImageURL: "/templates/corporate.jpg",
			IsActive:        true,
			SortOrder:       6,
			CreatedAt:       now,
			UpdatedAt:       now,
		},

		{
			ID:              "tpl_007",
			Name:            "Floral Wedding",
			Type:            "wedding",
			TemplateStyle:   "floral",
			AccentColor:     "#E8A0BF",
			Languages:       []string{"ru", "kz"},
			PreviewImageURL: "/templates/floral.jpg",
			IsActive:        true,
			SortOrder:       7,
			CreatedAt:       now,
			UpdatedAt:       now,
		},

		{
			ID:              "tpl_008",
			Name:            "Classic White",
			Type:            "wedding",
			TemplateStyle:   "classic",
			AccentColor:     "#FFFFFF",
			Languages:       []string{"ru"},
			PreviewImageURL: "/templates/classic.jpg",
			IsActive:        true,
			SortOrder:       8,
			CreatedAt:       now,
			UpdatedAt:       now,
		},

		{
			ID:              "tpl_009",
			Name:            "Night Party",
			Type:            "party",
			TemplateStyle:   "neon",
			AccentColor:     "#00FFFF",
			Languages:       []string{"ru"},
			PreviewImageURL: "/templates/party.jpg",
			IsActive:        true,
			SortOrder:       9,
			CreatedAt:       now,
			UpdatedAt:       now,
		},

		{
			ID:              "tpl_010",
			Name:            "Soft Pastel",
			Type:            "wedding",
			TemplateStyle:   "pastel",
			AccentColor:     "#FADADD",
			Languages:       []string{"ru", "kz"},
			PreviewImageURL: "/templates/pastel.jpg",
			IsActive:        true,
			SortOrder:       10,
			CreatedAt:       now,
			UpdatedAt:       now,
		},
	}

	for _, t := range templatesData {
		if err := templateRepo.Create(t); err != nil {
			return err
		}
	}

	return nil
}
