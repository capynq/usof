import { ERROR_CODES } from "../constants/errorCodes.js";
import { BaseProperty, BaseResource, ValidationError } from "adminjs";
import { AppError } from "../errors/AppError.js";

const admin = (context) => {
  const currentAdmin = context?.currentAdmin;
  if (currentAdmin?.role === "admin") return currentAdmin;
  throw new ValidationError(
    {},
    { message: "Administrator access is required." },
  );
};

const validation = (error, field = "base") => {
  if (error instanceof ValidationError) return error;
  const message =
    error instanceof AppError
      ? error.message
      : "The record could not be saved.";
  const fields = {};
  if (
    error instanceof AppError &&
    error.code === ERROR_CODES.VALIDATION_ERROR
  ) {
    for (const [name, messages] of Object.entries(error.fieldErrors ?? {}))
      fields[name] = { message: messages[0] };
  }
  if (!Object.keys(fields).length) fields[field] = { message };
  return new ValidationError(fields, { message });
};

const write = async (operation, field) => {
  try {
    return await operation();
  } catch (error) {
    throw validation(error, field);
  }
};

const equal = (left, right) => {
  if (left === undefined && right === undefined) return true;
  if (left === null || left === undefined)
    return right === null || right === undefined || right === "";
  if (right === null || right === undefined) return left === "";
  if (left instanceof Date || right instanceof Date) {
    const leftTime = new Date(left).getTime();
    const rightTime = new Date(right).getTime();
    return Number.isFinite(leftTime) && leftTime === rightTime;
  }
  return String(left) === String(right);
};

const writable = (params, current, names) => {
  const result = {};
  for (const [name, value] of Object.entries(params)) {
    if (names.includes(name)) {
      result[name] = value;
    } else if (!equal(value, current[name])) {
      throw new ValidationError({
        [name]: { message: "This field cannot be changed." },
      });
    }
  }
  return result;
};

const categoryIds = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value !== "string") return value;
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

const formatPost = (post) => ({
  ...post,
  categories: Array.isArray(post.categories)
    ? post.categories.map((category) => category.id ?? category).join(",")
    : (post.categories ?? ""),
});

const formatReaction = (reaction) => ({
  ...reaction,
  target: reaction.post_id ? "post" : "comment",
  target_id: reaction.post_id ?? reaction.comment_id,
});

const sortRows = (rows, sort = {}) => {
  const { sortBy, direction = "asc" } = sort;
  if (!sortBy) return rows;
  const multiplier = direction === "desc" ? -1 : 1;
  return [...rows].sort(
    (left, right) =>
      String(left[sortBy] ?? "").localeCompare(
        String(right[sortBy] ?? ""),
        undefined,
        { numeric: true },
      ) * multiplier,
  );
};

class ModelResource extends BaseResource {
  constructor({
    id,
    fields,
    options,
    list,
    get,
    create,
    update,
    remove,
    page,
    count,
  }) {
    super();
    this.resourceId = id;
    this.fields = fields.map(
      (field, position) =>
        new BaseProperty({
          path: field.name,
          type: field.type,
          isId: field.id === true,
          isSortable:
            id === "Posts"
              ? ["like_count", "publish_date"].includes(field.name)
              : field.sortable !== false,
          position,
        }),
    );
    this.options = options;
    this.handlers = { list, get, create, update, remove, page, count };
  }

  databaseName() {
    return "Usof";
  }
  databaseType() {
    return "other";
  }
  id() {
    return this.resourceId;
  }
  properties() {
    return this.fields;
  }
  property(path) {
    return this.fields.find((field) => field.path() === path) || null;
  }

  async count(_filter, context) {
    const viewer = admin(context);
    if (this.handlers.count) return this.handlers.count(viewer);
    return (await this.handlers.list(viewer)).length;
  }

  async find(_filter, options = {}, context) {
    const viewer = admin(context);
    if (this.handlers.page)
      return (await this.handlers.page(viewer, options)).map((row) =>
        this.build(row),
      );
    const rows = sortRows(await this.handlers.list(viewer), options.sort);
    const offset = Number(options.offset) || 0;
    const limit = Number(options.limit) || 10;
    return rows.slice(offset, offset + limit).map((row) => this.build(row));
  }

  async findOne(id, context) {
    const viewer = admin(context);
    try {
      return this.build(await this.handlers.get(id, viewer));
    } catch (error) {
      if (error instanceof AppError && error.status === 404) return null;
      throw error;
    }
  }

  async findMany(ids, context) {
    const rows = await Promise.all(ids.map((id) => this.findOne(id, context)));
    return rows.filter(Boolean);
  }

  async create(params, context) {
    const viewer = admin(context);
    return write(() => this.handlers.create(params, viewer), "base");
  }

  async update(id, params, context) {
    const viewer = admin(context);
    return write(async () => {
      const current = await this.handlers.get(id, viewer);
      return this.handlers.update(id, params, current, viewer);
    }, "base");
  }

  async delete(id, context) {
    const viewer = admin(context);
    return write(() => this.handlers.remove(id, viewer), "base");
  }
}

const fields = {
  users: [
    { name: "id", type: "number", id: true },
    { name: "login", type: "string" },
    { name: "email", type: "string" },
    { name: "full_name", type: "string" },
    { name: "role", type: "string" },
    { name: "rating", type: "number" },
    { name: "profile_picture", type: "string" },
    { name: "created_at", type: "datetime" },
    { name: "updated_at", type: "datetime" },
    { name: "password", type: "password" },
    { name: "password_confirmation", type: "password" },
  ],
  posts: [
    { name: "id", type: "number", id: true },
    { name: "author_id", type: "number" },
    { name: "title", type: "string" },
    { name: "content", type: "textarea" },
    { name: "categories", type: "string" },
    { name: "status", type: "string" },
    { name: "like_count", type: "number" },
    { name: "reaction_count", type: "number" },
    { name: "publish_date", type: "datetime" },
    { name: "updated_at", type: "datetime" },
  ],
  categories: [
    { name: "id", type: "number", id: true },
    { name: "title", type: "string" },
    { name: "description", type: "textarea" },
    { name: "created_at", type: "datetime" },
    { name: "updated_at", type: "datetime" },
  ],
  comments: [
    { name: "id", type: "number", id: true },
    { name: "post_id", type: "number" },
    { name: "author_id", type: "number" },
    { name: "content", type: "textarea" },
    { name: "status", type: "string" },
    { name: "publish_date", type: "datetime" },
    { name: "updated_at", type: "datetime" },
  ],
  reactions: [
    { name: "id", type: "number", id: true },
    { name: "author_id", type: "number" },
    { name: "target", type: "string" },
    { name: "target_id", type: "number" },
    { name: "post_id", type: "number" },
    { name: "comment_id", type: "number" },
    { name: "type", type: "string" },
    { name: "created_at", type: "datetime" },
  ],
};

const protectedActions = (edit) => ({
  new: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === "admin" },
  edit: {
    isAccessible: ({ currentAdmin }) => edit && currentAdmin?.role === "admin",
  },
  show: { isAccessible: ({ currentAdmin }) => currentAdmin?.role === "admin" },
  list: {
    isAccessible: ({ currentAdmin }) => currentAdmin?.role === "admin",
    showFilter: false,
  },
  delete: {
    isAccessible: ({ currentAdmin }) => currentAdmin?.role === "admin",
  },
  bulkDelete: { isVisible: false, isAccessible: false },
  search: { isVisible: false, isAccessible: false },
});

export const adminResources = (services) => {
  const users = new ModelResource({
    id: "Users",
    fields: fields.users,
    options: {
      navigation: { name: "Content" },
      listProperties: ["id", "login", "email", "full_name", "role", "rating"],
      showProperties: [
        "id",
        "login",
        "email",
        "full_name",
        "role",
        "rating",
        "profile_picture",
        "created_at",
        "updated_at",
      ],
      newProperties: [
        "login",
        "email",
        "full_name",
        "role",
        "password",
        "password_confirmation",
      ],
      editProperties: ["login", "email", "full_name", "role"],
      filterProperties: [],
      properties: {
        role: {
          availableValues: [
            { value: "user", label: "User" },
            { value: "admin", label: "Administrator" },
          ],
        },
        password: {
          isVisible: { list: false, show: false, edit: true, filter: false },
        },
        password_confirmation: {
          isVisible: { list: false, show: false, edit: true, filter: false },
        },
      },
      actions: protectedActions(true),
    },
    list: (viewer) => services.users.list(viewer),
    get: (id, viewer) => services.users.get(id, viewer),
    create: async (params) =>
      services.users.create(
        writable(params, {}, [
          "login",
          "email",
          "password",
          "password_confirmation",
          "role",
          "full_name",
        ]),
      ),
    update: async (id, params, current, viewer) => {
      const result = await services.users.update(
        id,
        writable(params, current, ["login", "email", "full_name", "role"]),
        viewer,
      );
      return result.user ?? result;
    },
    remove: (id, viewer) => services.users.delete(id, viewer),
  });

  const posts = new ModelResource({
    id: "Posts",
    fields: fields.posts,
    options: {
      sort: { sortBy: "like_count", direction: "desc" },
      navigation: { name: "Content" },
      listProperties: [
        "id",
        "title",
        "author_id",
        "status",
        "like_count",
        "publish_date",
      ],
      showProperties: [
        "id",
        "title",
        "content",
        "categories",
        "author_id",
        "status",
        "like_count",
        "reaction_count",
        "publish_date",
        "updated_at",
      ],
      newProperties: ["title", "content", "categories"],
      editProperties: ["categories", "status"],
      filterProperties: [],
      properties: {
        categories: { description: "Comma-separated category IDs" },
        status: {
          availableValues: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },
      },
      actions: protectedActions(true),
    },
    page: async (viewer, options) => {
      const pageSize = Number(options.limit ?? 10);
      const offset = Number(options.offset ?? 0);
      if (
        !Number.isSafeInteger(pageSize) ||
        pageSize < 1 ||
        pageSize > 100 ||
        !Number.isSafeInteger(offset) ||
        offset < 0 ||
        offset % pageSize !== 0
      )
        throw new AppError(
          400,
          ERROR_CODES.VALIDATION_ERROR,
          "Invalid page offset",
        );
      const result = await services.posts.list(
        {
          page: offset / pageSize + 1,
          page_size: pageSize,
          sort: options.sort?.sortBy === "publish_date" ? "date" : "likes",
        },
        viewer,
        { direction: options.sort?.direction === "asc" ? "asc" : "desc" },
      );
      return result.data.map(formatPost);
    },
    count: async (viewer) =>
      (await services.posts.list({ page: "1", page_size: "1" }, viewer)).meta
        .total,
    get: async (id, viewer) => formatPost(await services.posts.get(id, viewer)),
    create: async (params, viewer) =>
      formatPost(
        await services.posts.create(
          {
            ...writable(params, {}, ["title", "content", "categories"]),
            categories: categoryIds(params.categories),
          },
          viewer,
        ),
      ),
    update: async (id, params, current, viewer) => {
      const input = writable(params, current, ["categories", "status"]);
      if (Object.hasOwn(input, "categories"))
        input.categories = categoryIds(input.categories);
      return formatPost(await services.posts.update(id, input, viewer));
    },
    remove: (id, viewer) => services.posts.delete(id, viewer),
  });

  const categories = new ModelResource({
    id: "Categories",
    fields: fields.categories,
    options: {
      navigation: { name: "Content" },
      listProperties: ["id", "title", "description"],
      showProperties: [
        "id",
        "title",
        "description",
        "created_at",
        "updated_at",
      ],
      newProperties: ["title", "description"],
      editProperties: ["title", "description"],
      filterProperties: [],
      actions: protectedActions(true),
    },
    list: () => services.categories.list(),
    get: (id) => services.categories.get(id),
    create: (params) =>
      services.categories.create(
        writable(params, {}, ["title", "description"]),
      ),
    update: (id, params, current) =>
      services.categories.update(
        id,
        writable(params, current, ["title", "description"]),
      ),
    remove: (id) => services.categories.delete(id),
  });

  const comments = new ModelResource({
    id: "Comments",
    fields: fields.comments,
    options: {
      navigation: { name: "Content" },
      listProperties: ["id", "post_id", "author_id", "status", "publish_date"],
      showProperties: [
        "id",
        "post_id",
        "author_id",
        "content",
        "status",
        "publish_date",
        "updated_at",
      ],
      newProperties: ["post_id", "content"],
      editProperties: ["status"],
      filterProperties: [],
      properties: {
        status: {
          availableValues: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ],
        },
      },
      actions: protectedActions(true),
    },
    list: (viewer) => services.comments.list(viewer),
    get: (id, viewer) => services.comments.get(id, viewer),
    create: (params, viewer) => {
      const input = writable(params, {}, ["post_id", "content"]);
      return services.comments.create(
        input.post_id,
        { content: input.content },
        viewer,
      );
    },
    update: (id, params, current, viewer) =>
      services.comments.update(
        id,
        writable(params, current, ["status"]),
        viewer,
      ),
    remove: (id, viewer) => services.comments.delete(id, viewer),
  });

  const reactions = new ModelResource({
    id: "Reactions",
    fields: fields.reactions,
    options: {
      navigation: { name: "Content" },
      listProperties: [
        "id",
        "author_id",
        "target",
        "target_id",
        "type",
        "created_at",
      ],
      showProperties: [
        "id",
        "author_id",
        "target",
        "target_id",
        "post_id",
        "comment_id",
        "type",
        "created_at",
      ],
      newProperties: ["target", "target_id", "type"],
      editProperties: [],
      filterProperties: [],
      properties: {
        target: {
          availableValues: [
            { value: "post", label: "Post" },
            { value: "comment", label: "Comment" },
          ],
        },
        type: {
          availableValues: [
            { value: "like", label: "Like" },
            { value: "dislike", label: "Dislike" },
          ],
        },
      },
      actions: protectedActions(false),
    },
    list: async (viewer) =>
      (await services.reactions.listAll(viewer)).map(formatReaction),
    get: async (id, viewer) =>
      formatReaction(await services.reactions.get(id, viewer)),
    create: async (params, viewer) => {
      const input = writable(params, {}, ["target", "target_id", "type"]);
      return formatReaction(
        await services.reactions.create(
          input.target,
          input.target_id,
          input.type,
          viewer,
        ),
      );
    },
    update: () => {
      throw new ValidationError({}, { message: "Reactions cannot be edited." });
    },
    remove: async (id, viewer) => {
      const reaction = await services.reactions.get(id, viewer);
      return services.reactions.delete(
        reaction.post_id ? "post" : "comment",
        reaction.post_id ?? reaction.comment_id,
        viewer,
        reaction.author_id,
      );
    },
  });

  return [users, posts, categories, comments, reactions].map((resource) => {
    const { newProperties, ...options } = resource.options;
    options.actions.new.layout = newProperties;
    options.actions.edit.layout = options.editProperties;
    if (resource.id() === "Users") {
      const scrub = (response) => {
        if (response.record?.params) {
          delete response.record.params.password;
          delete response.record.params.password_confirmation;
        }
        return response;
      };
      options.actions.new.after = scrub;
      options.actions.edit.after = scrub;
    }
    return { resource, options };
  });
};
