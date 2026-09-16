// models/associations.js
import { User } from "./user.js";
import { Role } from "./role.js";
import { UserRole } from "./userRole.js";
import { Promotion } from "./promotion.js";
import { PromotionComment } from "./promotionComment.js";

// Many-to-Many: Users <-> Roles через таблицю userroles
User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userid",
  otherKey: "roleid",
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleid",
  otherKey: "userid",
});

User.hasMany(PromotionComment, { foreignKey: "userid" });
PromotionComment.belongsTo(User, { foreignKey: "userid" });
Promotion.hasMany(PromotionComment, { foreignKey: "promotionid" });
PromotionComment.belongsTo(Promotion, { foreignKey: "promotionid" });

import { MenuItem } from "./menuItem.js";
import { MenuItemReview } from "./menuItemReview.js";

User.hasMany(MenuItemReview, { foreignKey: "userid" });
MenuItemReview.belongsTo(User, { foreignKey: "userid" });

MenuItem.hasMany(MenuItemReview, { foreignKey: "menuitemid" });
MenuItemReview.belongsTo(MenuItem, { foreignKey: "menuitemid" });
