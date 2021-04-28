export interface CreateUserDto {
  token: string;
  phone: string;
  uid?: string;
  display_name: string;
  photo_url: string;
}
