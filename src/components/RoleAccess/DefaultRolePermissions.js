import {PermissionCategory,PermissionType,PermissionValues,Roles, CommonPermissionName, ListingSubCategory} from './../../enums/rolePermissionsEnums'

export const defaultPermissions = {
    roles: [Roles.AGENT, Roles.ADMIN, Roles.SUPER_ADMIN],
    
    permissionCategories: {
      [PermissionCategory.PROPERTY_LISTING]: {
        type: PermissionType.SIMPLE,
        permissions: {
          [CommonPermissionName.VIEW]: {
            possibleValues: [PermissionValues.YES, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.YES,
              [Roles.ADMIN]: PermissionValues.YES,
              [Roles.SUPER_ADMIN]: PermissionValues.YES
            }
          },
          [CommonPermissionName.CREATE]: {
            possibleValues: [PermissionValues.YES, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.YES,
              [Roles.ADMIN]: PermissionValues.YES,
              [Roles.SUPER_ADMIN]: PermissionValues.YES
            }
          },
          [CommonPermissionName.EDIT]: {
            possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.OWN,
              [Roles.ADMIN]: PermissionValues.ALL,
              [Roles.SUPER_ADMIN]: PermissionValues.ALL
            }
          },
          [CommonPermissionName.DELETE]: {
            possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.NO,
              [Roles.ADMIN]: PermissionValues.OWN,
              [Roles.SUPER_ADMIN]: PermissionValues.ALL
            }
          }
        }
      },
      
      [PermissionCategory.USER_MANAGEMENT]: {
        type: PermissionType.SIMPLE,
        permissions: {
            [CommonPermissionName.VIEW]: {
            possibleValues: [PermissionValues.YES, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.NO,
              [Roles.ADMIN]: PermissionValues.YES,
              [Roles.SUPER_ADMIN]: PermissionValues.YES
            }
          },
          [CommonPermissionName.CREATE]: {
            possibleValues: [PermissionValues.AGENTS, PermissionValues.ALL, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.NO,
              [Roles.ADMIN]: PermissionValues.AGENTS,
              [Roles.SUPER_ADMIN]: PermissionValues.ALL
            }
          },
          [CommonPermissionName.EDIT]: {
            possibleValues: [PermissionValues.AGENTS, PermissionValues.ALL, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.NO,
              [Roles.ADMIN]: PermissionValues.AGENTS,
              [Roles.SUPER_ADMIN]: PermissionValues.ALL
            }
          },
          [CommonPermissionName.DELETE]: {
            possibleValues: [PermissionValues.AGENTS, PermissionValues.ALL, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.NO,
              [Roles.ADMIN]: PermissionValues.AGENTS,
              [Roles.SUPER_ADMIN]: PermissionValues.ALL
            }
          }
        }
      },
      
      [PermissionCategory.FINANCIAL]: {
        type: PermissionType.SIMPLE,
        permissions: {
            [CommonPermissionName.VIEW]: {
            possibleValues: [PermissionValues.YES, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.NO,
              [Roles.ADMIN]: PermissionValues.YES,
              [Roles.SUPER_ADMIN]: PermissionValues.YES
            }
          },
          [CommonPermissionName.MANAGE]: {
            possibleValues: [PermissionValues.YES, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.NO,
              [Roles.ADMIN]: PermissionValues.YES,
              [Roles.SUPER_ADMIN]: PermissionValues.YES
            }
          }
        }
      },
      
      [PermissionCategory.SETTINGS]: {
        type: PermissionType.SIMPLE,
        permissions: {
            [CommonPermissionName.VIEW]: {
            possibleValues: [PermissionValues.YES, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.NO,
              [Roles.ADMIN]: PermissionValues.YES,
              [Roles.SUPER_ADMIN]: PermissionValues.YES
            }
          },
          [CommonPermissionName.EDIT]: {
            possibleValues: [PermissionValues.YES, PermissionValues.NO],
            defaultValues: {
              [Roles.AGENT]: PermissionValues.NO,
              [Roles.ADMIN]: PermissionValues.NO,
              [Roles.SUPER_ADMIN]: PermissionValues.YES
            }
          }
        }
      },
      
      [PermissionCategory.LISTING_TYPE]: {
        type: PermissionType.COMPLEX,
        subCategories: {
          [ListingSubCategory.POCKET]: {
            description: "Private Listings",
            permissions: {
              [CommonPermissionName.VIEW]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.OWN,
                  [Roles.ADMIN]: PermissionValues.ALL,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              },
              [CommonPermissionName.EDIT]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.OWN,
                  [Roles.ADMIN]: PermissionValues.ALL,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              },
              [CommonPermissionName.DELETE]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.NO,
                  [Roles.ADMIN]: PermissionValues.OWN,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              },
              [CommonPermissionName.PUBLISH]: {
                possibleValues: [PermissionValues.YES, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.NO,
                  [Roles.ADMIN]: PermissionValues.YES,
                  [Roles.SUPER_ADMIN]: PermissionValues.YES
                }
              }
            }
          },
          
          [ListingSubCategory.LIVE]: {
            description: "Publicly Visible Listings",
            permissions: {
              [CommonPermissionName.VIEW]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.ALL,
                  [Roles.ADMIN]: PermissionValues.ALL,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              },
              [CommonPermissionName.EDIT]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.NO,
                  [Roles.ADMIN]: PermissionValues.OWN,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              },
              [CommonPermissionName.DELETE]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.NO,
                  [Roles.ADMIN]: PermissionValues.OWN,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              }
            }
          },
          
          [ListingSubCategory.PUBLISH]: {
            permissions: {
              [CommonPermissionName.PUBLISH]: {
                possibleValues: [PermissionValues.YES, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.NO,
                  [Roles.ADMIN]: PermissionValues.YES,
                  [Roles.SUPER_ADMIN]: PermissionValues.YES
                }
              },
              [CommonPermissionName.UNPUBLISH]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.NO,
                  [Roles.ADMIN]: PermissionValues.OWN,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              }
            }
          },
          
          [ListingSubCategory.DRAFT]: {
            description: "Saved but not published",
            permissions: {
              [CommonPermissionName.VIEW]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.OWN,
                  [Roles.ADMIN]: PermissionValues.ALL,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              },
              [CommonPermissionName.EDIT]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.OWN,
                  [Roles.ADMIN]: PermissionValues.ALL,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              },
              [CommonPermissionName.DELETE]: {
                possibleValues: [PermissionValues.OWN, PermissionValues.ALL, PermissionValues.NO],
                defaultValues: {
                  [Roles.AGENT]: PermissionValues.OWN,
                  [Roles.ADMIN]: PermissionValues.ALL,
                  [Roles.SUPER_ADMIN]: PermissionValues.ALL
                }
              }
            }
          }
        }
      }
    }
  };