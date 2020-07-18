export default {
  methods: {
    prepareTour (tour) {
      const { name, slug, tour_code, name_short, excerpt, operator_id, media_id, hero_id, gallery_id, accommodation_gallery_id, content, highlights, name_operator, status, length, balance_due, months, difficulty, bike_and_boat, guidance, nights, deleted, solo_cyclists_allowed, start_point, finish_point, arrival_days } = tour
      return {
        name,
        slug,
        tour_code,
        name_short,
        excerpt,
        operator_id,
        media_id,
        hero_id,
        gallery_id,
        accommodation_gallery_id,
        content,
        highlights,
        name_operator,
        status,
        length,
        balance_due,
        months,
        difficulty,
        guidance,
        bike_and_boat,
        nights,
        deleted,
        solo_cyclists_allowed,
        start_point,
        finish_point,
        arrival_days
      }
    }
  }
}
