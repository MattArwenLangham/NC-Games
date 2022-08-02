\c  nc_games_test

SELECT comments.* FROM reviews
JOIN comments ON reviews.review_id = comments.review_id
WHERE reviews.review_id = 2;