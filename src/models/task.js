export default class Taks {
  constructor(data) {
    this.id = data[`id`];
    this.description = data[`description`] || ``;
    this.dueDate = data[`due_date`] ? new Date(data[`due_date`]) : null;
    this.tags = new Set(data[`tags`] || []);
    this.repeatingDays = data[`repeating_days`];
    this.color = data[`color`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.isArchive = Boolean(data[`is_archived`]);
  }

  toRAW() {
    return {
      'id': this.id,
      'description': this.description,
      'due_date': this.dueDate ? this.dueDate.toISOString() : null,
      'tags': Array.from(this.tags),
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_archived': this.isArchive,
    };
  }
}
