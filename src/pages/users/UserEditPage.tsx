import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { UserForm, type UserFormData } from "../../components/users/UserForm";
import { useState, useEffect } from "react";
import { fetchUser, updateUser } from "../../services/userApi";

export function UserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>(undefined);

  useEffect(() => {
    const getUserData = async () => {
      try {
        setIsLoading(true);
        const user = await fetchUser(Number(id));
        setUserData(user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      getUserData();
    }
  }, [id]);

  const handleSubmit = async (data: UserFormData) => {
    try {
      setErrors(undefined);
      const payload = { ...data };
      if (!payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }
      await updateUser(Number(id), payload);
      navigate("/users");
    } catch (error: any) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      } else {
        console.error("Error updating user:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      <PageHeader
        title="Edit User Profile"
        breadcrumbs={[
          { label: "User Management", path: "/users" },
          { label: "Edit User" },
        ]}
      />

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <UserForm
          isEdit
          initialData={userData}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/users")}
          externalErrors={errors}
        />
      </div>
    </div>
  );
}
