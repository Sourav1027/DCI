
import Swal from 'sweetalert2';

export const deleteConfirmation = async (deleteCallback) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: " #6366f1",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    showClass: {
      popup: "animate__animated animate__fadeInDown animate__faster"
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown animate__faster"
    }
  });

  if (result.isConfirmed) {
    // Execute the delete callback if provided
    if (deleteCallback) {
      await deleteCallback();
    }

    // Show success message
    await Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success",
      showClass: {
        popup: "animate__animated animate__fadeInUp animate__faster"
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutDown animate__faster"
      }
    });
  }

  return result.isConfirmed;
};