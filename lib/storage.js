const STAMPS_KEY = "bt.stamps";
const REVIEWS_NS = "bt.reviews.";

export function loadStamps() {
  try {
    return new Set(JSON.parse(localStorage.getItem(STAMPS_KEY) || "[]"));
  } catch {
    return new Set();
  }
}

export function saveStamps(set) {
  localStorage.setItem(STAMPS_KEY, JSON.stringify([...set]));
}

export function loadReviews(id) {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_NS + id) || "[]");
  } catch {
    return [];
  }
}

export function addReview(id, review) {
  const next = [review, ...loadReviews(id)];
  localStorage.setItem(REVIEWS_NS + id, JSON.stringify(next));
  return next;
}

export function stars(rating) {
  const n = Math.round(Number(rating));
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
}
